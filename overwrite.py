import os

def main() -> None:
  print(os.listdir("."))
  print(os.listdir("./node_modules/@nuxt/ui-pro/dist/shared/"))
  files = os.listdir("./node_modules/@nuxt/ui-pro/dist/shared/")
  with open(files[0], "w+", encoding="utf-8") as file:
    content = file.read()
    arr = content.splitlines()
    arr[-1] = "export { version as a, addTemplates as b, getTemplates as g, icons as i, name as n, theme as t };"
    file.writelines(arr)
  
  with open("./node_modules/@nuxt/ui-pro/dist/module.mjs", "w+", encoding="utf-8") as file:
    content = file.read()
    arr = content.splitlines()
    arr[4] = "import { a as version, n as name, i as icons, b as addTemplates, t as theme } from './shared/ui-pro.B6uD94pG.mjs';"
    arr[119] = "      return;"
    file.writelines(arr)


  with open("./node_modules/@nuxt/ui-pro/dist/unplugin.mjs", "w+", encoding="utf-8") as file:
    content = file.read()
    arr = content.splitlines()
    arr[6] = "import { g as getTemplates, i as icons, t as theme } from './shared/ui-pro.B6uD94pG.mjs';"
    arr[82] = "      return;"
    file.writelines(arr)


if __name__ == "__main__":
  main()
  exit(0)