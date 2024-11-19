import SignIn from "@/components/auth/sign-in";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Authentication | DataFab",
	description:
		"Sign in or create an account for DataFab Secure Collaboration Platform",
};

export default function page() {
	return (
		<div className="">
			<SignIn />
		</div>
	);
}
