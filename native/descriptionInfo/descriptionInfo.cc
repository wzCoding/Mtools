#include <napi.h>
#include <windows.h>
#pragma comment(lib, "version.lib")

std::string WStringToString(const std::wstring &wstr) {
    int size_needed = WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), NULL, 0, NULL, NULL);
    std::string strTo(size_needed, 0);
    WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), &strTo[0], size_needed, NULL, NULL);
    return strTo;
}

Napi::Value GetFileDescription(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    std::string path = info[0].As<Napi::String>();
    std::wstring wPath(path.begin(), path.end());

    DWORD dummy;
    DWORD size = GetFileVersionInfoSizeW(wPath.c_str(), &dummy);
    if (size == 0) return Napi::String::New(env, "");

    std::vector<BYTE> data(size);
    if (GetFileVersionInfoW(wPath.c_str(), 0, size, data.data())) {
        struct LANGANDCODEPAGE { WORD wLanguage; WORD wCodePage; } *lpTranslate;
        UINT len;
        if (VerQueryValueW(data.data(), L"\\VarFileInfo\\Translation", (LPVOID *)&lpTranslate, &len)) {
            wchar_t subBlock[50];
            swprintf_s(subBlock, 50, L"\\StringFileInfo\\%04x%04x\\FileDescription", lpTranslate[0].wLanguage, lpTranslate[0].wCodePage);
            LPVOID lpBuffer;
            if (VerQueryValueW(data.data(), subBlock, &lpBuffer, &len)) {
                return Napi::String::New(env, WStringToString(reinterpret_cast<wchar_t*>(lpBuffer)));
            }
        }
    }
    return Napi::String::New(env, "");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("getFileDescription", Napi::Function::New(env, GetFileDescription));
    return exports;
}
NODE_API_MODULE(getFileDescription, Init)