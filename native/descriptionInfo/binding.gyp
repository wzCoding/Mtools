{
  "targets": [
    {
      "target_name": "descriptionInfo",
      "sources": [ "descriptionInfo.cc" ],

      # 核心配置: 指向根目录 node_modules
      "include_dirs": [
        "../../node_modules/node-addon-api"
      ],
      "libraries": [ 
          "-lpsapi", 
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1,
          "AdditionalOptions": [ "/utf-8" ]
        }
      },
      "conditions": [
        ['OS=="win"', {
          "defines": [ "_HAS_EXCEPTIONS=1" ]
        }],
        ['OS=="mac"', {
          "cflags+": ["-fvisibility=hidden"],
          "xcode_settings": {
            "GCC_SYMBOLS_PRIVATE_EXTERN": "YES", 
            "CLANG_CXX_LIBRARY": "libc++",
            "MACOSX_DEPLOYMENT_TARGET": "10.13"
          }
        }]
      ]
    }
  ]
}