export default () => ({
    secret: process.env.JWT_SECRET || "secretKey",
    expiresIn: process.env.JWT_EXPIRATION_TIME || "1h",
});
