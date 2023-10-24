import {
  AiFillMobile,
  AiOutlineDesktop,
  AiOutlineLaptop,
} from "react-icons/ai";
import { MdOutlineKeyboard, MdStorefront, MdTv, MdWatch } from "react-icons/md";

export const categories = [
  {
    label: "All",
    icon: MdStorefront,
    value: "All",
  },
  {
    label: "Phone",
    icon: AiFillMobile,
    value: "Phone",
  },
  {
    label: "Laptop",
    icon: AiOutlineLaptop,
    value: "Laptop",
  },
  {
    label: "Desktop",
    icon: AiOutlineDesktop,
    value: "Desktop",
  },
  {
    label: "Watch",
    icon: MdWatch,
    value: "Watch",
  },
  {
    label: "TV",
    icon: MdTv,
    value: "TV",
  },
  {
    label: "Accesories",
    icon: MdOutlineKeyboard,
    value: "Accesories",
  },
];

export const weightOptions = [
  { label: "lb", value: "lb" },
  { label: "oz", value: "oz" },
  { label: "kg", value: "kg" },
  { label: "g", value: "g" },
];

export const statusOptions = [
  { label: "active", value: "active" },
  { label: "draft", value: "draft" },
];
