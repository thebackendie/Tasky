const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require('../../config/db_connection').sequelize;

const User = require('./userModel');


const RefreshTokens = sequelize.define('refresh_tokens', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      token_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      user: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: User,
          key: 'id'
        },
      },
      is_blacklisted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }
}, {
  tableName: 'refresh_tokens'
});

module.exports = RefreshTokens;