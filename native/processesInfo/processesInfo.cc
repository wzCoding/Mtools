#include <napi.h>
#include <windows.h>
#include <tlhelp32.h>
#include <vector>
#include <string>
#include <map>

// 辅助工具：宽字符转 UTF8
std::string WStringToString(const std::wstring &wstr) {
    if (wstr.empty()) return "";
    int size_needed = WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), NULL, 0, NULL, NULL);
    std::string strTo(size_needed, 0);
    WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), &strTo[0], size_needed, NULL, NULL);
    return strTo;
}

// 获取基础进程列表
std::vector<Napi::Object> GetProcessList(Napi::Env env) {
    std::vector<Napi::Object> list;
    
    // 获取可见窗口映射
    std::map<DWORD, bool> visiblePids;
    EnumWindows([](HWND hwnd, LPARAM lParam) -> BOOL {
        if (IsWindowVisible(hwnd)) {
            DWORD pid;
            GetWindowThreadProcessId(hwnd, &pid);
            reinterpret_cast<std::map<DWORD, bool>*>(lParam)->operator[](pid) = true;
        }
        return TRUE;
    }, reinterpret_cast<LPARAM>(&visiblePids));

    HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (hSnapshot == INVALID_HANDLE_VALUE) return list;

    PROCESSENTRY32W pe32 = { sizeof(PROCESSENTRY32W) };
    if (Process32FirstW(hSnapshot, &pe32)) {
        do {
            Napi::Object obj = Napi::Object::New(env);
            obj.Set("pid", (uint32_t)pe32.th32ProcessID);
            obj.Set("ppid", (uint32_t)pe32.th32ParentProcessID);
            obj.Set("name", WStringToString(pe32.szExeFile));
            obj.Set("type", (visiblePids.count(pe32.th32ProcessID) ? "app" : "background"));
            
            // 获取文件路径 (简单版，仅获取路径)
            HANDLE hProcess = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, FALSE, pe32.th32ProcessID);
            if (hProcess) {
                wchar_t pathBuf[MAX_PATH];
                DWORD chars = MAX_PATH;
                if (QueryFullProcessImageNameW(hProcess, 0, pathBuf, &chars)) {
                    obj.Set("path", WStringToString(pathBuf));
                }
                CloseHandle(hProcess);
            }
            list.push_back(obj);
        } while (Process32NextW(hSnapshot, &pe32));
    }
    CloseHandle(hSnapshot);
    return list;
}

// 导出方法
Napi::Value GetProcesses(const Napi::CallbackInfo& info) {
    auto env = info.Env();
    auto data = GetProcessList(env);
    Napi::Array arr = Napi::Array::New(env, data.size());
    for(size_t i=0; i<data.size(); i++) arr[i] = data[i];
    return arr;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("getProcesses", Napi::Function::New(env, GetProcesses));
    return exports;
}

NODE_API_MODULE(processesInfo, Init)