const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {}
  Blog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      recordStatus: {
        type: DataTypes.ENUM,
        values: ['LATEST', 'DELETED'],
        defaultValue: 'LATEST',
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        author: {
          type: DataTypes.STRING,
          allowNull: false,
        },
    },
    {
      initialAutoIncrement: 1000000,

      sequelize,
      tableName: 'Blogs',
      freezeTableName: true,
      underscored: true,
    }
  );
  return Blog;
};