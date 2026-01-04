import { redirect } from "next/navigation";

export default function HomePage() {
    // Redirect to the Timer page (main entry point)
    redirect("/timer");
}
