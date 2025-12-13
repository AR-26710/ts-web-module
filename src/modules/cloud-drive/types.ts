// 网盘链接组件类型定义

// 网盘类型枚举
export type CloudDriveType = '百度网盘' | '阿里云盘' | '腾讯微云' | '坚果云' | string;

// 网盘链接组件属性接口
export interface CloudDriveAttributes {
  type?: CloudDriveType;
  url?: string;
  password?: string;
  title?: string;
}
