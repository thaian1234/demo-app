import { RequestResetPasswordForm } from "@/features/auth/components/request-reset-password-form";
import { VerifyResetPasswordForm } from "@/features/auth/components/verify-reset-password-form";
import { useParams } from "react-router-dom";

export default function ResetPasswordPage() {
    const { token } = useParams<{ token: string | undefined }>();

    if (!token) {
        return <RequestResetPasswordForm />;
    }

    return <VerifyResetPasswordForm token={token} />;
}
