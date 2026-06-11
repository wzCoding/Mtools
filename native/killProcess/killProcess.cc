#include <napi.h>
#include <windows.h>
#include <vector>

// 窗口枚举回调：查找属于指定 PID 的窗口
struct EnumData {
    DWORD pid;
    bool foundWindow;
};

BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam) {
    EnumData* data = (EnumData*)lParam;
    DWORD windowPid;
    GetWindowThreadProcessId(hwnd, &windowPid);
    
    if (windowPid == data->pid && IsWindowVisible(hwnd)) {
        // 发送 WM_CLOSE 消息 (优雅退出)
        PostMessage(hwnd, WM_CLOSE, 0, 0);
        data->foundWindow = true;
    }
    return TRUE;
}

Napi::Value KillProcess(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    DWORD pid = info[0].As<Napi::Number>().Uint32Value();

    // 1. 尝试优雅关闭 (通过窗口消息)
    EnumData data = { pid, false };
    EnumWindows(EnumWindowsProc, (LPARAM)&data);

    // 等待 500ms 让进程有机会处理关闭消息
    Sleep(500);

    // 2. 检查进程是否还活着
    HANDLE hProcess = OpenProcess(PROCESS_TERMINATE | PROCESS_QUERY_LIMITED_INFORMATION, FALSE, pid);
    if (hProcess == NULL) {
        // 获取失败或权限不足
        return Napi::Number::New(env, (GetLastError() == ERROR_ACCESS_DENIED) ? 2 : 0);
    }

    DWORD exitCode;
    GetExitCodeProcess(hProcess, &exitCode);
    if (exitCode == STILL_ACTIVE) {
        // 依然活着，强制终止
        if (!TerminateProcess(hProcess, 1)) {
            CloseHandle(hProcess);
            return Napi::Number::New(env, 2); // 权限不足
        }
    }

    CloseHandle(hProcess);
    return Napi::Number::New(env, 1); // 成功
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("killProcess", Napi::Function::New(env, KillProcess));
    return exports;
}
NODE_API_MODULE(killProcess, Init)