def main() -> None:
  file = open("./node_modules/@nuxt/ui-pro/dist/module.mjs", "r", encoding="utf-8")
  content = file.read()
  arr = content.splitlines()
  arr[4] = "import { a as version, n as name, i as icons, b as addTemplates, t as theme } from './shared/ui-pro.B6uD94pG.mjs';"
  arr[119] = "      return;"
  file.close()
  file = open("./node_modules/@nuxt/ui-pro/dist/module.mjs", "w", encoding="utf-8")
  file.write("\n".join(arr))
  file.close()

  file = open("./node_modules/@nuxt/ui-pro/dist/unplugin.mjs", "r", encoding="utf-8")
  content = file.read()
  arr = content.splitlines()
  arr[6] = "import { g as getTemplates, i as icons, t as theme } from './shared/ui-pro.B6uD94pG.mjs';"
  arr[82] = "      return;"
  file.close()
  file = open("./node_modules/@nuxt/ui-pro/dist/unplugin.mjs", "w", encoding="utf-8")
  file.write("\n".join(arr))
  file.close()


if __name__ == "__main__":
  main()
  exit(0)