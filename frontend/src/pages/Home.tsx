import { CheckCircle, Clock, Mail, Github } from "lucide-react"
import { useAuthPanel } from "@/auth/AuthPanelContext"
import { NavLink } from "react-router-dom"
import { ROUTES } from "@/router"

export function Home() {
  const backend = {
    finished: [
      <>
        Custom <b>user model</b> and <b>authentication system</b>
      </>,
      <>
        <b>JWT authentication</b> with <b>refresh rotation</b> and <b>token blacklisting</b>
      </>,
      <>
        Login with <b>username or email</b>
      </>,
      <>
        Centralized <b>API response structure</b> and <b>error handling</b>
      </>,
      <>
        Custom <b>exception handler</b> with unified <b>error codes</b>
      </>,
      <>
        Parameterized <b>backend validation errors</b> returned to frontend
      </>,
      <>
        Reusable <b>backend validators</b> and <b>validation utilities</b>
      </>,
      <>
        <b>User account management</b> (register, delete, profile data)
      </>,
      <>
        <b>Account settings flows</b> (username, email, password change)
      </>,
    ],
    planned: [
      <>
        Automatically <b>translate recipe</b> on creation/edit
      </>,
      <>
        Implement <b>translation tables</b> for recipes and ingredients
      </>,
      <>
        Implement <b>ratings and comments</b>
      </>,
      <>
        Support <b>search</b> for recipes by ingredients and content across languages
      </>,
      <>
        Store <b>recipe images</b> in a dedicated backend storage
      </>,
      <>
        Implement shopping lists with <b>recipe auto-fill, synchronization and sharing across users</b> (WebSocket?)
      </>,
    ],
  }

  const frontend = {
    finished: [
      <>
        <b>Responsive</b> design and <b>mobile-friendly</b> UI
      </>,
      <>
        <b>Internationalization (i18n)</b> and translation handling
      </>,
      <>
        <b>Theme system - </b> dark and light mode
      </>,
      <>
        Authentication system with global <b>AuthContext</b>
      </>,
      <>
        Automatic <b>JWT refresh</b> and session initialization
      </>,
      <>
        <b>Protected routes</b> and authentication state management
      </>,
      <>
        Frontend <b>validation synchronized with backend</b> error codes
      </>,
      <>
        Reusable <b>form system</b> with shared validation utilities
      </>,
      <>
        Rich, dynamic{" "}
        <NavLink
          to={ROUTES.recipeCreate}
          className="font-semibold text-(--accent-primary) underline hover:text-(--accent-secondary)"
        >
          <b>recipe creation form</b>
        </NavLink>
      </>,
      <>
        <b>Reusable UI components</b> system
      </>,
      <>
        Improved <b>UX</b> with loading overlays, hover interactions, toasts and modals
      </>,
    ],
    planned: [
      <>
        Add <b>dynamic servings amount adjustment</b> with ingredient recalculation
      </>,
      <>
        Implement <b>ratings and comments</b>
      </>,
      <>
        Create <b>shopping lists</b> page
      </>,
    ],
  }

  const sectionData = [
    { title: "BACKEND", data: backend },
    { title: "FRONTEND", data: frontend },
  ]

  const renderItem = (icon: React.ReactNode, text: React.ReactNode, key: number | string) => (
    <li key={key} className="flex items-center gap-2 py-2 sm:gap-3 md:gap-4">
      {icon}
      <span>{text}</span>
    </li>
  )

  const { togglePanel } = useAuthPanel()

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-md bg-(--bg-secondary) p-1 shadow-md min-[420px]:p-1.5 sm:p-2">
      <article className="overflow-hidden rounded-xl border-2 bg-(--bg-primary) shadow-sm">
        <header className="border-b px-2 py-4 min-[420px]:px-4 sm:px-8 sm:py-6 lg:px-16">
          <div className="flex flex-col gap-6 text-center text-3xl font-bold">Project Overview</div>
        </header>

        <div className="px-2 py-4 min-[420px]:px-4 sm:px-8 sm:py-8 lg:px-16">
          <div className="flex flex-col gap-2 pb-4 leading-relaxed sm:pb-6">
            <h3 className="mb-2 text-2xl font-semibold text-(--accent-primary)">Hi,</h3>
            <div>
              This GitHub page represents the <b>frontend of a full-stack application</b> for sharing recipes. You can
              view the whole {" "}
              <a
                href="https://github.com/heatgub/recipes"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-(--accent-primary) hover:text-(--accent-secondary)"
              >
                repository on GitHub
              </a>
              . The full application will eventually be hosted as a complete project, but it is still under active
              development as I continue to refine features and add new ideas.
              <br />
              <br />
              <div className="text-center text-xl font-semibold">TECH STACK</div>
              <div className="mx-auto mt-2 grid max-w-70 grid-cols-1 gap-2 text-center sm:max-w-200 sm:grid-cols-3">
                <div className="rounded-lg border bg-(--bg-secondary) px-3 py-2 text-sm shadow-sm">
                  <span className="font-semibold text-(--accent-primary)">Backend</span>
                  <div className="mt-1 flex flex-wrap justify-center gap-2">
                    <span className="rounded bg-(--bg-primary) px-2 py-0.5 text-xs font-medium">Django</span>
                    <span className="rounded bg-(--bg-primary) px-2 py-0.5 text-xs font-medium">DRF</span>
                  </div>
                </div>

                <div className="rounded-lg border bg-(--bg-secondary) px-3 py-2 text-sm shadow-sm">
                  <span className="font-semibold text-(--accent-primary)">Frontend</span>
                  <div className="mt-1 flex flex-wrap justify-center gap-2">
                    <span className="rounded bg-(--bg-primary) px-2 py-0.5 text-xs font-medium">React</span>
                    <span className="rounded bg-(--bg-primary) px-2 py-0.5 text-xs font-medium">TypeScript</span>
                    <span className="rounded bg-(--bg-primary) px-2 py-0.5 text-xs font-medium">Tailwind</span>
                  </div>
                </div>

                <div className="rounded-lg border bg-(--bg-secondary) px-3 py-2 text-sm shadow-sm">
                  <span className="font-semibold text-(--accent-primary)">Database</span>
                  <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                    <span className="rounded bg-(--bg-primary) px-2 py-0.5 text-xs font-medium">PostgreSQL</span>
                  </div>
                </div>
              </div>
              <br />
              <br />
              This particular page is not bilingual and will eventually be replaced, along with any example backend
              content. Other parts of the application are <b>internationalized</b>. Login, register, and logout
              functionality is mocked for frontend-only testing, so{" "}
              <span
                onClick={() => togglePanel("login")}
                className="cursor-pointer font-semibold text-(--accent-primary) underline hover:text-(--accent-secondary)"
              >
                try logging in
              </span>{" "}
              using any credentials to explore the user interface.
              <br />
              <br />
              For any questions or feedback, you can reach me here:
              <div className="flex flex-col px-2 pt-2 sm:px-4">
                {/* Email */}
                <a
                  href="mailto:ptrchm@proton.me"
                  className="flex w-max items-center gap-3 py-1 font-semibold text-(--accent-primary) hover:text-(--accent-secondary)"
                >
                  <Mail className="h-5 w-5" />
                  ptrchm@proton.me
                </a>
                {/* GitHub */}
                <a
                  href="https://github.com/heatgub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-max items-center gap-3 py-1 font-semibold text-(--accent-primary) hover:text-(--accent-secondary)"
                >
                  <Github className="h-5 w-5" />
                  github.com/heatgub
                </a>
              </div>
              <br />
              Below you will find a list of checkpoints showing the current progress of the application. This list is
              updated regularly to reflect ongoing development.
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            {sectionData.map((section) => (
              <div
                key={section.title}
                className="mx-auto max-w-60 rounded-xl border break-all min-[500px]:break-normal md:max-w-75 lg:max-w-90"
              >
                <div className="rounded-t-xl bg-(--bg-secondary)">
                  <h2
                    className="border-b py-2 text-center text-xl font-bold"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    {section.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 px-2 py-2 sm:gap-4 sm:px-4 sm:py-3 lg:px-6 lg:py-6">
                  <div>
                    <h3 className="border-b pb-2 pl-1 text-lg font-bold text-(--text-success)">Completed</h3>
                    <ul className="pt-2 sm:ml-2">
                      {section.data.finished.map((item, index) =>
                        renderItem(<CheckCircle size={20} className="shrink-0 text-(--text-success)" />, item, index)
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="border-b pb-2 pl-1 text-lg font-bold text-(--text-secondary)">Roadmap</h3>
                    <ul className="pt-2 sm:ml-2">
                      {section.data.planned.map((item, index) =>
                        renderItem(<Clock size={20} className="shrink-0 text-(--text-muted)" />, item, index)
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
