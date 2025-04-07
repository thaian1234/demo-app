const jwtConstants = {
    secret: process.env.JWT_SECRET || "secretKey",
    expiresIn: process.env.JWT_EXPIRATION_TIME || "1h",
};

const errorConstants = {
    invalidCredentials: "Invalid credentials",
    userNotFound: "User not found",
    existingUser: "User already exists",
    userNotCreated: "Failed to create user",
    tokenBlacklisted: "Token is blacklisted",
};

const successConstants = {
    userCreated: "User created successfully",
    loginSuccess: "Login successful",
    logoutSuccess: "Logout successful",
    tokenSuccess: "Token generated successfully",
};

export const authConstants = {
    jwt: jwtConstants,
    error: errorConstants,
    success: successConstants,
};
