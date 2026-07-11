import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import type { Plugin } from 'vite';

type WatchHookOptions = {
  daemon: string[];
};

const watchHook = ({ daemon }: WatchHookOptions): Plugin => {
  let daemonProcess: ChildProcess | null = null;
  const startDaemon = () => {
    if (daemonProcess) {
      daemonProcess.kill();
      daemonProcess = null;
    }

    const [command, ...args] = daemon;
    daemonProcess = spawn(command, args, { stdio: 'inherit' });
    daemonProcess.on('error', err => {
      console.error('[watchhook] daemon failed with error', err);
    });

    daemonProcess.on('exit', (code, signal) => {
      console.info(`[watchhook] daemon exited with code ${code ?? signal}`);
    });

    console.info('[watchhook] Running daemon...');
  };

  return {
    name: 'watchhook',
    writeBundle() {
      if (this.environment.config.build.watch) {
        startDaemon();
      }
    },
    closeWatcher() {
      if (daemonProcess) {
        daemonProcess.kill();
        daemonProcess = null;
      }
    },
  };
};

export default watchHook;
