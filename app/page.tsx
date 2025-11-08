import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      {/*Top section*/}
      <div className="relative w-full p-2">
        <img 
          src={'/Canada_web.svg'}
          alt="Canada Flag"
          className="absolute top-2 left-2 w-40 h-20"
        />
      {/*Title*/}
        <div className="flex items-center justify-center mt-28 p-2">
          <h1 className="w-full text-center font-bold tracking-tight 
               text-5xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mt-8"> 
            Beans are us
          </h1>
          <div className="absolute mt-60">
                <Link href="/auth/login">
                  <button className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition" >
                  Sign in
                  </button>
                </Link>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
      </div>
    </main>
  );
}
