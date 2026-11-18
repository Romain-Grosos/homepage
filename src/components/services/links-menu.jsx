import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import classNames from "classnames";
import ResolvedIcon from "components/resolvedicon";
import { useContext } from "react";
import { BiChevronDown } from "react-icons/bi";
import { SettingsContext } from "utils/contexts/settings";

export default function LinksMenu({ service }) {
  const { settings } = useContext(SettingsContext);

  return (
    <Menu as="div" className="flex-1 flex service-links-menu">
      <MenuButton className="group/links flex-1 flex items-center rounded-md cursor-pointer text-left focus:outline-hidden service-links-button">
        {service.icon && (
          <div className="shrink-0 flex items-center justify-center w-12 service-icon z-10">
            <ResolvedIcon icon={service.icon} />
          </div>
        )}
        <div className="flex-1 px-2 py-2 text-sm text-left z-10 service-name">
          {service.name}
          <p className="text-theme-500 dark:text-theme-300 text-xs font-light service-description">
            {service.description}
          </p>
        </div>
        <BiChevronDown
          className="shrink-0 mr-2 h-5 w-5 z-10 transition-transform group-data-open/links:rotate-180 service-links-chevron"
          aria-hidden="true"
        />
      </MenuButton>

      <MenuItems
        anchor="bottom start"
        transition
        className={classNames(
          "z-50 min-w-(--button-width) [--anchor-gap:--spacing(1)] rounded-md p-1 focus:outline-hidden",
          "bg-theme-50/90 dark:bg-theme-800/90 backdrop-blur-sm shadow-md shadow-theme-900/20",
          "text-theme-700 dark:text-theme-200",
          "transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0",
          "service-links-items",
        )}
      >
        {service.links.map((link) => (
          <MenuItem key={`${link.name}-${link.href}`}>
            <a
              href={link.href}
              target={link.target ?? service.target ?? settings.target ?? "_blank"}
              rel="noreferrer"
              className="flex items-center rounded-md px-2 py-1.5 text-sm data-focus:bg-theme-300/50 dark:data-focus:bg-white/10 service-link"
            >
              {link.icon && (
                <span className="shrink-0 flex items-center justify-center w-6 h-6 mr-2 service-link-icon">
                  <ResolvedIcon icon={link.icon} width={24} height={24} />
                </span>
              )}
              <span className="flex-1 service-link-name">
                {link.name}
                {link.description && (
                  <span className="block text-theme-500 dark:text-theme-300 text-xs font-light service-link-description">
                    {link.description}
                  </span>
                )}
              </span>
            </a>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
