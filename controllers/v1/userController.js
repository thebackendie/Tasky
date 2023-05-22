const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const User = require('../models/v1/userModel');


exports.getAccount = asyncHandler( async(req, res, next) => {
    try {
        const user_id = req.user.id;
        const user = await User.findByPk(user_id);
        if (!user)
            return next(new AppError('User not found!', 404));
        res.status(200).json({
            success: true,
            message: "Data retrieved!",
            data: user
        });
    } catch (error) {
        next(error);
    }
});
    
exports.updateAccount = asyncHandler( async(req, res, next) => {
    try {
        const user_id = req.user.id;
        const user = await User.findByPk(user_id);
        if (!user)
            return next(new AppError('User not found!', 404));
        await user.update(req.body);
        res.status(200).json({
            success: true,
            message: "Account updated!"
        });
    } catch (error) {
        next(error);
    }
});
    
exports.updatePassword = asyncHandler( async(req, res, next) => {
    try {
        const user_id = req.user.id;
        const user = await User.findByPk(user_id);
        if (!user)
            return next(new AppError('User not found!', 404));

        // 2) Check if POSTed current password is correct
        if (!(await user.comparePassword(req.body.passwordCurrent, user.password))) {
            return next(new AppError('Your current password is wrong.', 401));
        }

        // 3) If so, update password
        await user.update(req.body.password);

        res.status(200).json({
            success: true,
            message: "User account password updated!"
        });
    } catch (error) {
        next(error);
    }
});

exports.terminateAccount = asyncHandler( async(req, res, next) => {
    try {
        const user_id = req.user.id;
        const user = await User.findByPk(user_id);
        if (!user)
            return next(new AppError('User not found!', 404));
        await user.update({is_terminated: true});
        res.status(200).json({
            success: true,
            message: "Account terminated"
        });
    } catch (error) {
        next(error);
    }
});

exports.reactivateAccount = asyncHandler( async(req, res, next) => {
    try {
        const user_id = req.user.id;
        const user = await User.findByPk(user_id);
        if (!user)
            return next(new AppError('User not found!', 404));
        await user.update({is_terminated: false});
        res.status(200).json({
            success: true,
            message: "Account reactivated"
        });
    } catch (error) {
        next(error);
    }
});

// For Admins
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    try {
        const getUsers = await User.findAll();
        res.status(200).json({
            success: true,
            message: "Data retrieved!",
            data: getUsers
        });
    } catch (error) {
        next(error);
    }

});

exports.getUser = asyncHandler(async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if (!user)
            return next(new AppError('User not found!', 404));
        res.status(200).json({
            success: true,
            message: "Data retrieved!",
            data: user
        });

    } catch (error) {
        next(error);
    }
});
    
exports.deactivateUser = asyncHandler(async (req, res, next) => {
    try {
        const user_id = req.params.id;
        const user = await User.findByPk(user_id);
        if (!user)
            return next(new AppError('User not found!', 404));
        await user.update({status: 'inactive'});
        res.status(200).json({
            success: true,
            message: "Account deactivated"
        });
    } catch (error) {
        next(error);
    }
});

exports.activateUser = asyncHandler(async (req, res, next) => {
    try {
        const user_id = req.params.id;
        const user = await User.findByPk(user_id);
        if (!user)
            return next(new AppError('User not found!', 404));
        await user.update({status: 'active'});
        res.status(200).json({
            success: true,
            message: "Account activated"
        });
    } catch (error) {
        next(error);
    }
});