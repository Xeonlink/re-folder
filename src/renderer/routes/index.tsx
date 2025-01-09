import ImgLogo from "@renderer/assets/icon.png";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { on } from "@renderer/lib/utils";
import { keyboardMoveToTabIndex } from "@renderer/lib/arrowNavigation";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: Page,
});

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.5,
    },
  },
};

function Page() {
  const navigate = useNavigate();

  return (
    <ScrollArea className="flex-1">
      <main className="relative flex min-h-full flex-col items-center justify-center gap-4 p-4">
        <motion.div
          className="mb-8"
          initial={{
            scale: 1,
            rotate: 0,
            y: -200,
          }}
          animate={{
            scale: 2.2,
            rotate: 360,
            y: 0,
          }}
          transition={{
            type: "spring",
            duration: 2,
            bounce: 0.3,
          }}
        >
          <img src={ImgLogo} alt="re-folder" className="h-6" />
        </motion.div>

        <motion.ol className="flex w-64 flex-col gap-2" variants={container} initial="hidden" animate="show">
          <motion.li variants={item}>
            <Button
              variant="ghost"
              size="lg"
              className="w-full text-lg"
              autoFocus
              tabIndex={1}
              onClick={() => navigate({ to: "/folder-presets" })}
              onKeyDown={on(keyboardMoveToTabIndex("ArrowUp", 3), keyboardMoveToTabIndex("ArrowDown", 2))}
            >
              폴더 프리셋
            </Button>
          </motion.li>

          <motion.li variants={item}>
            <Button
              variant="ghost"
              size="lg"
              className="w-full text-lg"
              tabIndex={2}
              onClick={() => navigate({ to: "/watchers" })}
              onKeyDown={on(keyboardMoveToTabIndex("ArrowUp", 1), keyboardMoveToTabIndex("ArrowDown", 3))}
            >
              감시자
            </Button>
          </motion.li>

          <motion.li variants={item}>
            <Button
              variant="ghost"
              size="lg"
              className="w-full text-lg"
              tabIndex={3}
              onClick={() => navigate({ to: "/settings" })}
              onKeyDown={on(keyboardMoveToTabIndex("ArrowUp", 2), keyboardMoveToTabIndex("ArrowDown", 1))}
            >
              설정
            </Button>
          </motion.li>
        </motion.ol>
      </main>
    </ScrollArea>
  );
}
