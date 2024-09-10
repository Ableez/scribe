import { Loader2 } from "lucide-react";
import { Suspense, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <Suspense
      fallback={
        <div className="grid h-screen place-items-center justify-center align-middle">
          <h4 className="flex place-items-center justify-center gap-2 align-middle text-sm font-semibold text-neutral-500">
            <Loader2
              size={18}
              className="duration-&lsqb;1.618s&rsqb; animate-spin"
            />
            Loading...
          </h4>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default layout;
