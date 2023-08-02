import {
  FC,
  HTMLAttributes,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { ComponentPanel } from "@/page/App/components/ComponentPanel"
import { ConfigPanel } from "@/page/App/components/ConfigPanel"
import { PagePanel } from "@/page/App/components/PagePanel"
import { getSelectedComponents } from "@/redux/config/configSelector"
import { getCurrentPageDisplayName } from "@/redux/currentApp/executionTree/executionSelector"
import { FocusManager } from "@/utils/focusManager"
import { applyTabItemStyle, menuHeaderWrapperStyle } from "./style"

const getRenderBody = (activeKey: string) => {
  switch (activeKey) {
    case "Inspect": {
      return <ConfigPanel />
    }
    case "Page": {
      return <PagePanel />
    }
    case "Insert":
    default: {
      return <ComponentPanel />
    }
  }
}

export const ComponentsManager: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  const { t } = useTranslation()

  const [activeKey, setActiveKey] = useState("Insert")

  const selectedDisplayNames = useSelector(getSelectedComponents)
  const currentPageDisplayName = useSelector(getCurrentPageDisplayName)
  const prevPageDisplayName = useRef<string>(currentPageDisplayName)
  const isClickChange = useRef<boolean>(false)

  useEffect(() => {
    if (!isClickChange.current) {
      if (selectedDisplayNames.length > 0) {
        setActiveKey("Inspect")
      } else {
        if (activeKey === "Page") {
          setActiveKey("Page")
        }
        if (activeKey === "Inspect") {
          setActiveKey("Insert")
        }
      }
    }
    if (prevPageDisplayName.current !== currentPageDisplayName) {
      prevPageDisplayName.current = currentPageDisplayName
    }
    isClickChange.current = false
  }, [activeKey, currentPageDisplayName, selectedDisplayNames])

  const handleClickChangeTab: MouseEventHandler<HTMLDivElement> = (e) => {
    const activeKey = (e.target as HTMLSpanElement)?.dataset?.key
    if (activeKey) {
      isClickChange.current = true
      setActiveKey(activeKey)
    }
  }

  return (
    <div
      className={props.className}
      onKeyDown={()=>console.log("compManag")}
      onClick={() => {
        FocusManager.switchFocus("components")
      }}
    >
      <div css={menuHeaderWrapperStyle}  onKeyDown={()=>console.log("compManag")} onClick={handleClickChangeTab}>
        <span css={applyTabItemStyle(activeKey === "Page")} data-key="Page">
          {t("editor.page.tab_title")}
        </span>
        <span
          css={applyTabItemStyle(activeKey === "Inspect")}
          data-key="Inspect"
        >
          {t("editor.inspect.tab_title")}
        </span>
        <span css={applyTabItemStyle(activeKey === "Insert")} data-key="Insert">
          {t("editor.widget_picker.tab_title")}
        </span>
      </div>
      <>{getRenderBody(activeKey)}</>
    </div>
  )
}

export default ComponentsManager

ComponentsManager.displayName = "ComponentsManager"
