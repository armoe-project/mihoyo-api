<div align="center">

![][banner]

![][rust]
![][rocket]
![][license]

</div>

## 简介

米哈游API 米游社/原神/崩坏3等

## 功能列表

* 角色资料查询
* EnkaNetwork镜像


## 使用

* 前往 [Releases](https://github.com/armoe-project/mihoyo-api/releases) 下载对应设备二进制文件
* 运行二进制文件
  
## 配置

在程序同级目录创建文件 `Rocket.toml`

```toml
[default]
address = "0.0.0.0" # 绑定地址
port = 8000 # 端口号
log_level = "normal" # 日志等级
```

更多配置项请参考 [Rocket 文档](https://rocket.rs/v0.5-rc/guide/configuration)

## 开发

```shell
# 克隆代码
git clone https://github.com/armoe-project/mihoyo-api.git
# 运行开发服务器
cargo run
```

## 开源协议

本项目使用 [GPL-3.0](LICENSE) 协议开放源代码

```text
mihoyo-api - miHoYo API
Copyright (C) 2022 ZhenXin
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
```

## 鸣谢

* [Visual Studio Code](https://code.visualstudio.com/)
* [Rust](https://www.rust-lang.org/zh-CN/)
* [Rocket](https://rocket.rs/)

[banner]: https://socialify.git.ci/armoe-project/mihoyo-api/image?forks=1&issues=1&language=1&name=1&owner=1&pulls=1&stargazers=1&theme=Light

[rust]: https://img.shields.io/badge/rust-1.64.0--2021-blue?style=for-the-badge

[rocket]: https://img.shields.io/badge/rocket-0.5.0--rc.2-blue?style=for-the-badge

[license]: https://img.shields.io/github/license/RealHeart/ZMusic?style=for-the-badge
