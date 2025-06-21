import os

def main() -> None:
  with open("./node_modules/@nuxt/ui-pro/dist/module.mjs", "wr+", encoding="utf-8") as file:
    content = file.read()
    print(content)
    arr = content.splitlines()
    print("#")
    print(arr)
    arr[4] = "import { a as version, n as name, i as icons, b as addTemplates, t as theme } from './shared/ui-pro.B6uD94pG.mjs';"
    arr[119] = "      return;"
    file.writelines(arr)


  with open("./node_modules/@nuxt/ui-pro/dist/unplugin.mjs", "wr+", encoding="utf-8") as file:
    content = file.read()
    print(content)
    arr = content.splitlines()
    print("#")
    print(arr)
    arr[6] = "import { g as getTemplates, i as icons, t as theme } from './shared/ui-pro.B6uD94pG.mjs';"
    arr[82] = "      return;"
    file.writelines(arr)


if __name__ == "__main__":
  main()
  exit(0)