module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "user_roles",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      discord_id: {
        type: DataTypes.STRING,
        defaultValue: "0",
      },
      role_id: {
        type: DataTypes.STRING,
        defaultValue: "0",
      },
    },
    {
      tableName: "user_roles",
      timestamps: false,
    },
  );
};
