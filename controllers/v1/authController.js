const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const User = require('../models/userModel');
const jwtTokenModel = require('../../models/v1/jwtTokenModel');


const generateToken = (id, token_type, expiresIn) => {
    return jwt.sign({ id , token_type}, process.env.JWT_SECRET_KEY, { expiresIn });
};

const generateRefreshToken = (id, token_type, expiresIn) => {
    return jwt.sign({ id , token_type}, process.env.JWT_SECRET_KEY, { expiresIn });
};

exports.signUp = asyncHandler(async (req, res, next) => {
    const email = req.body.email;

    const user = await User.findOne({ email: email });
    if (!user) {
        // Create User
        try {
            const newUser = await User.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: newUser
            });
        } catch (error) {
            next(error);
        }

    } else {
        next(new AppError('User already exists', 400));
    }

});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
     
    let user = await User.findOne({ attributes: { exclude: ['createdAt', 'updatedAt'] }, where: { email} });
    if (user && await user.comparePassword(password, user.password)) {
        const access_token = generateToken(user?.id, 'access_token', '1d');
        const refresh_token = generateRefreshToken(user?.id, 'refresh_token', '3d');

        await jwtTokenModel.create({ token: refresh_token, token_type:'refresh', user:user.id});

        user = await User.findOne({ attributes: { exclude: ['password','createdAt', 'updatedAt'] }, where: { email} });

        res.cookie('access_token', access_token, {
            maxAge:24 * 60 * 60 * 1000,
            httpOnly: true
        }); 
        res.cookie('refresh_token', refresh_token, {
            maxAge:72 * 60 * 60 * 1000,
            httpOnly: true
        });   
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: { access_token, refresh_token, user }
        });

    } else {
        return next(new AppError('Invalid Credentials', 400));
    }

});

exports.handleRefreshToken = asyncHandler(async (req, res, next) => {
    // Check if refresh token exists
    const cookie = req.cookies;
    if (!cookie.refresh_token) 
        return next(new AppError('No Refresh Token', 400));
    
    // Get the refresh token
    const refreshToken = cookie.refresh_token;

    // Find it's user
    const user = await jwtTokenModel.findAll({ where: {token: refreshToken}});
    if (!user) return next(new AppError('Refresh token is not linked to a user.', 400));
    // Blacklist the token
    await jwtTokenModel.create({ token: refreshToken, token_type:'refresh', user:req.user.id, is_blacklisted: true});
    // Verify the token
    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {

    if (err || user.id !== decoded.id) {
        return new AppError('There is something wrong with refresh token', 400)
    }

    // Generate and send new refresh and access tokens
    const access_token = generateToken(user?.id, 'access_token', '1d');
    const refresh_token = generateToken(user?.id, 'refresh_token', '3d');

    res.cookie('access_token', access_token, {
        maxAge:24 * 60 * 60 * 1000,
        httpOnly: true
    }); 

    res.cookie('refresh_token', refresh_token, {
        maxAge:72 * 60 * 60 * 1000,
        httpOnly: true
    });   

    res.status(200).json({ access_token, refresh_token});

    });

});

exports.logout = asyncHandler(async (req, res, next) => {
// check for refresh and access tokens
const cookie = req.cookies;
if (!cookie.refresh_token)
    return next(new AppError('No Refresh Token', 400));
if (!cookie.access_token)
    return next(new AppError('No Access Token', 400));

// Get refresh and access tokens
const refreshToken = cookie.refresh_token;
const accessToken = cookie.access_token;

// Blacklist Refresh Tokens
const blacklistRefreshToken = await jwtTokenModel.findOne({ where: { token: refreshToken, user:req.user.id}});
if (!blacklistRefreshToken) {
    await jwtTokenModel.create({ token: refreshToken, token_type:'refresh', user:req.user.id, is_blacklisted: true});
} else{
    await blacklistRefreshToken.update({is_blacklisted: true});
}

// Blacklist Access Tokens
const blacklistAccessToken = await jwtTokenModel.findOne({ where: {token: accessToken, user:req.user.id}});
if (!blacklistAccessToken) {
    await jwtTokenModel.create({ token: accessToken, token_type:'access', user:req.user.id, is_blacklisted: true});
} else{
    await blacklistAccessToken.update({is_blacklisted: true});
}

// Clear cookies
res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: true
});
res.clearCookie('access_token', {
    httpOnly: true,
    secure: true
});
return res.sendStatus(204);

});
