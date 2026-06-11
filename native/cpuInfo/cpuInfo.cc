#include <napi.h>
#include <windows.h>

// ---------------------------------------------------------
// 辅助函数：将 FILETIME 转换为毫秒 (double)
// Windows FILETIME 是 100纳秒为单位
// ---------------------------------------------------------
double FileTimeToMS(const FILETIME& ft) {
    ULARGE_INTEGER ul;
    ul.LowPart = ft.dwLowDateTime;
    ul.HighPart = ft.dwHighDateTime;
    // 1 ms = 10,000 * 100ns
    return (double)ul.QuadPart / 10000.0;
}

// ---------------------------------------------------------
// 1. 获取指定 PID 的 CPU 总耗时 (Kernel + User)
// ---------------------------------------------------------
Napi::Value GetProcessCpuTime(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsNumber()) {
        return Napi::Number::New(env, 0);
    }
    
    DWORD pid = info[0].As<Napi::Number>().Uint32Value();
    double result = 0.0;

    HANDLE hProcess = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, FALSE, pid);
    if (hProcess) {
        FILETIME ftCreation, ftExit, ftKernel, ftUser;
        if (GetProcessTimes(hProcess, &ftCreation, &ftExit, &ftKernel, &ftUser)) {
            // 进程的总 CPU 时间 = 内核时间 + 用户时间
            result = FileTimeToMS(ftKernel) + FileTimeToMS(ftUser);
        }
        CloseHandle(hProcess);
    }

    return Napi::Number::New(env, result);
}

// ---------------------------------------------------------
// 2. 获取系统全局 CPU 时间快照
// 返回对象: { idle: number, kernel: number, user: number }
// ---------------------------------------------------------
Napi::Value GetSystemCpuTimes(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    FILETIME ftIdle, ftKernel, ftUser;
    if (GetSystemTimes(&ftIdle, &ftKernel, &ftUser)) {
        Napi::Object result = Napi::Object::New(env);
        
        result.Set("idle", Napi::Number::New(env, FileTimeToMS(ftIdle)));
        result.Set("kernel", Napi::Number::New(env, FileTimeToMS(ftKernel)));
        result.Set("user", Napi::Number::New(env, FileTimeToMS(ftUser)));
        
        return result;
    }
    
    return env.Null();
}

// ---------------------------------------------------------
// 初始化导出
// ---------------------------------------------------------
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    
    // 新增：CPU 相关方法
    exports.Set(Napi::String::New(env, "getProcessCpuTime"), Napi::Function::New(env, GetProcessCpuTime));
    exports.Set(Napi::String::New(env, "getSystemCpuTimes"), Napi::Function::New(env, GetSystemCpuTimes));
    
    return exports;
}

NODE_API_MODULE(cpuInfo, Init)