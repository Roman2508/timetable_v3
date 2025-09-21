import { ImSafari } from "react-icons/im";
import { SiOperagx } from "react-icons/si";
import { LiaAndroid } from "react-icons/lia";
import { TfiHelpAlt } from "react-icons/tfi";
import { RiEdgeNewLine } from "react-icons/ri";

import { TfiApple } from "react-icons/tfi";
import type { IconType } from "react-icons/lib";
import { FaFirefoxBrowser } from "react-icons/fa";
import { PiGoogleChromeLogoLight } from "react-icons/pi";
import { LiaYandexInternational } from "react-icons/lia";

const getDeviceIcon = (browser: string, os: string): IconType => {
  if (os.toLowerCase() === "android") {
    return LiaAndroid;
  }

  if (os.toLowerCase() === "ios") {
    return TfiApple;
  }

  switch (browser.toLowerCase()) {
    case "chrome":
      return PiGoogleChromeLogoLight;
    case "firefox":
      return FaFirefoxBrowser;
    case "safari":
      return ImSafari;
    case "edge":
      return RiEdgeNewLine;
    case "microsoft edge":
      return RiEdgeNewLine;
    case "opera":
      return SiOperagx;
    case "yandex":
      return LiaYandexInternational;
    case "yandex browser":
      return LiaYandexInternational;
    default:
      return TfiHelpAlt;
  }
};

export default getDeviceIcon;
