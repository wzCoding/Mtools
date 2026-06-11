#include <napi.h>
#include <windows.h>
#include <psapi.h>

#pragma comment(lib, "psapi.lib")

// =========================================================
// 1. 获取指定 PID 的内存信息
// =========================================================
Napi::Value GetProcessesMemoryInfo(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "PID expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    DWORD pid = info[0].As<Napi::Number>().Uint32Value();
    
    // 默认返回值
    double workingSet = 0;
    double privateUsage = 0;

    HANDLE hProcess = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ, FALSE, pid);

    if (hProcess) {
        PROCESS_MEMORY_COUNTERS_EX pmc;
        if (GetProcessMemoryInfo(hProcess, (PROCESS_MEMORY_COUNTERS*)&pmc, sizeof(pmc))) {
            workingSet = (double)pmc.WorkingSetSize;
            privateUsage = (double)pmc.PrivateUsage;
        }
        CloseHandle(hProcess);
    }
    
    Napi::Object result = Napi::Object::New(env);
    result.Set("workingSet", Napi::Number::New(env, workingSet));
    result.Set("privateUsage", Napi::Number::New(env, privateUsage));

    return result;
}

// =========================================================
// 2. 获取系统内存信息
// =========================================================
Napi::Value GetSystemMemoryInfo(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    MEMORYSTATUSEX memInfo;
    memInfo.dwLength = sizeof(MEMORYSTATUSEX);

    if (GlobalMemoryStatusEx(&memInfo)) {
        Napi::Object result = Napi::Object::New(env);
        result.Set("total", Napi::Number::New(env, (double)memInfo.ullTotalPhys));
        result.Set("free", Napi::Number::New(env, (double)memInfo.ullAvailPhys));
        result.Set("load", Napi::Number::New(env, memInfo.dwMemoryLoad));
        result.Set("totalVirtual", Napi::Number::New(env, (double)memInfo.ullTotalPageFile));
        return result;
    }

    return env.Null();
}

// =========================================================
// 3. Init
// =========================================================
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    // 修正重载匹配问题：直接使用字符串字面量
    exports.Set("getProcessMemory", Napi::Function::New(env, GetProcessesMemoryInfo));
    exports.Set("getSystemMemory", Napi::Function::New(env, GetSystemMemoryInfo));
    return exports;
}

NODE_API_MODULE(memoryInfo, Init)