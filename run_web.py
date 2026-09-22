"""在 PyCharm 中右键运行此文件，启动 Vue 网页开发服务。"""

from pathlib import Path
import shutil
import subprocess


def main():
    project = Path(__file__).resolve().parent
    node = shutil.which("node")
    if not node:
        bundled_node = (
            Path.home()
            / ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe"
        )
        if bundled_node.is_file():
            node = str(bundled_node)
    if not node:
        raise SystemExit("未找到 Node.js，请安装 Node.js 22.12 或更高版本后重启 PyCharm。")

    vite = project / "node_modules/vite/bin/vite.js"
    if not vite.is_file():
        raise SystemExit("缺少项目依赖，请在 task-manager-vue 文件夹的终端执行 npm install。")

    print("正在启动任务管理网页，请点击下方 Vite 输出的 Local 地址。", flush=True)
    print("通常为 http://127.0.0.1:5173/；端口被占用时会自动使用其他端口。", flush=True)
    print("保持此运行窗口开启。停止时点击 PyCharm 的红色停止按钮。\n", flush=True)
    process = subprocess.Popen([node, str(vite), "--host", "127.0.0.1"], cwd=project)
    try:
        return process.wait()
    except KeyboardInterrupt:
        return 0
    finally:
        if process.poll() is None:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()


if __name__ == "__main__":
    raise SystemExit(main())
