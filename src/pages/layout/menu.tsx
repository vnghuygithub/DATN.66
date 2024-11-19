import { FC, ReactNode } from 'react';
import { Menu } from 'antd';
import { MenuList } from '../../interface/layout/menu.interface';
import { useNavigate } from 'react-router-dom';
import { CustomIcon } from './customIcon';
import { useDispatch, useSelector } from 'react-redux';
import { setUserItem } from '@/stores/user.store';

const { SubMenu, Item } = Menu;

interface MenuProps {
  menuList: MenuList;
  openKey?: string;
  onChangeOpenKey: (key?: string) => void;
  selectedKey: string;
  onChangeSelectedKey: (key: string) => void;
}

const MenuComponent: FC<MenuProps> = props => {
  const {
    menuList,
    openKey,
    onChangeOpenKey,
    selectedKey,
    onChangeSelectedKey,
  } = props;
  const { device, locale } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getTitle = (menu: MenuList[0]) => {
    return (
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <CustomIcon type={menu.icon!} />
        <span>{menu.label[locale]}</span>
      </span>
    );
  };

  const onMenuClick = (path: string) => {
    onChangeSelectedKey(path);
    navigate(path);
    if (device !== 'DESKTOP') {
      dispatch(setUserItem({ collapsed: true }));
    }
  };

  const onOpenChange = (keys: string[]) => {
    const key = keys.pop();
    onChangeOpenKey(key);
  };

  const renderMenu = (menu: MenuList[0]): ReactNode => {
    if (menu.children) {
      return (
        <SubMenu key={menu.code} title={getTitle(menu)} style={{marginLeft: -10}}>
          {menu.children.map(renderMenu)}
        </SubMenu>
      );
    } else {
      return <Item key={menu.path}>{getTitle(menu)}</Item>;
    }
  };

  return (
    <Menu
      mode="inline"
      theme="light"
      selectedKeys={[selectedKey]}
      onSelect={k => onMenuClick(k.key)}
      style={{ width: 230,}}
      className="layout-page-sider-menu  text-2">
      {menuList.map(renderMenu)}
      
    </Menu>
  );
};

export default MenuComponent;