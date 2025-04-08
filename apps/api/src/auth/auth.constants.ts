import jwtConfig from "src/utils/configs/jwtConfig";

const jwtConstants = jwtConfig();

const errorConstants = {
    invalidCredentials: "Invalid credentials",
    userNotFound: "User not found",
    existingUser: "User already exists",
    userNotCreated: "Failed to create user",
    tokenBlacklisted: "Token is blacklisted",
    emailNotVerified: "Your email is not verified",
    invalidCode: "Invalid code",
};

const successConstants = {
    userCreated: "User created successfully",
    loginSuccess: "Login successful",
    logoutSuccess: "Logout successful",
    tokenSuccess: "Token generated successfully",
    emailVerified: "Email verified successfully",
};

export const authConstants = {
    jwt: jwtConstants,
    error: errorConstants,
    success: successConstants,
};
