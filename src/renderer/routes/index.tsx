import ImgLogo from "@renderer/assets/icon.png";
import { wait } from "@renderer/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();

  return (
    <main className="w-full px-2 gap-2 mb-2 mt-1">
      <motion.div
        onAnimationComplete={async () => {
          await wait(1000);
          navigate({ to: "/watchers", replace: true });
        }}
        className="fixed"
        initial={{
          translateY: "-50%",
          translateX: "-50%",
          left: "50%",
          top: 25,
          scale: 1,
          rotate: 0,
        }}
        animate={{
          top: "50%",
          scale: 4,
          rotate: 360,
        }}
        transition={{
          type: "spring",
          ease: "linear",
          duration: 1.8,
          delay: 0,
        }}
      >
        <img src={ImgLogo} alt="re-folder" className="h-6" />
      </motion.div>
    </main>
  );
}
