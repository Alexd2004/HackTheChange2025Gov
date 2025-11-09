// import { DeployButton } from "@/components/deploy-button";
// import { EnvVarWarning } from "@/components/env-var-warning";
// import { AuthButton } from "@/components/auth-button";
// import { Hero } from "@/components/hero";
// import { ThemeSwitcher } from "@/components/theme-switcher";
// import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
// import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/lib/utils";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <main className="min-h-screen flex flex-col items-center">
//       {/*Top section*/}
//       <div className="relative w-full p-2">
//         <img 
//           src={'/Canada_web.svg'}
//           alt="Canada Flag"
//           className="absolute top-2 left-2 w-40 h-20"
//         />
//       {/*Title*/}
//         <div className="flex items-center justify-center mt-28 p-2">
//           <h1 className="w-full text-center font-bold tracking-tight 
//                text-5xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mt-8"> 
//             Beans are us
//           </h1>
//           <div className="absolute mt-60">
//                 <Link href="/auth/login">
//                   <button className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition" >
//                   Sign in
//                   </button>
//                 </Link>
//           </div>
//         </div>
//       </div>
//       <div className="flex-1 w-full flex flex-col gap-20 items-center">
//       </div>
//     </main>
//   );
// }
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="relative flex h-svh flex-col items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-br from-primary/10 via-background to-secondary/30" />
        <div className="absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl md:h-[26rem] md:w-[26rem]" />
        <div className="absolute bottom-[-10%] right-[-15%] h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <section className="relative flex max-w-5xl flex-col items-center gap-10 text-center md:gap-12">
        <Image
          src="/Canada_web.svg"
          alt="Canada Flag"
          width={192}
          height={96}
          className="h-20 w-40 md:h-24 md:w-48 drop-shadow-lg"
          priority
        />
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-primary sm:text-5xl md:text-6xl">
            Beans are us
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Empowering communities with equitable access to essential resources.
            Join us in making a meaningful impact for those who need it most.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            asChild
            className="w-full bg-red-700 text-white py-6 px-8 text-xl font-bold hover:bg-red-900 sm:w-auto"
          >
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
