import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authApi } from "@/features/auth/api";
import { SignOutButton } from "@/features/auth/components/signout-button";
import { formatDistanceToNow } from "date-fns";

export default function HomePage() {
    const authQuery = authApi.query.useGetProfile();
    const { data, isPending, isError } = authQuery;

    if (isPending || !data) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error loading profile</div>;
    }

    const profile = data.data;

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>

            <Card className="max-w-2xl mx-auto">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={""} alt={profile.username} />
                        <AvatarFallback>
                            {profile.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">{profile.username}</CardTitle>
                        <CardDescription>@{profile.username}</CardDescription>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <SignOutButton />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                            <p className="text-base">{profile.email}</p>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
                            <p className="text-base">@{profile.username}</p>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Member Since
                            </h3>
                            <p className="text-base">
                                {new Date(profile.createdAt).toLocaleDateString("en-US")}
                                <span className="text-muted-foreground ml-2">
                                    ({formatDistanceToNow(profile.createdAt, { addSuffix: true })})
                                </span>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
