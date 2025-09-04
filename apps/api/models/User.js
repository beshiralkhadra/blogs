const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 120],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      initialAutoIncrement: 1,
      sequelize,
      tableName: 'Users',
      freezeTableName: true,
      underscored: true,
      hooks: {
        beforeValidate(user) {
          if (user.email) user.email = String(user.email).toLowerCase();
        },
      },
      indexes: [
        { unique: true, fields: ['email'] },
      ],
    }
  );
  return User;
};
