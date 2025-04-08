import { useParams } from "react-router-dom";

export default function ResetPasswordPage() {
    const { token } = useParams<{ token: string | undefined }>();

    if (!token) {
        return <div>Invalid token</div>;
    }

    return <div>ResetPasswordPage</div>;
}
