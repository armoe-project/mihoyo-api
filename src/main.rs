#[macro_use]
extern crate rocket;

use rocket::{log::LogLevel, Config};

use routes::{error, genshin, index};

pub mod api;
pub mod routes;
pub mod utils;

#[launch]
fn rocket() -> _ {
    let mut config = Config::default();
    config.log_level = LogLevel::Normal; // 日志等级
    rocket::build()
        .configure(config)
        .mount("/", routes![index::get_index, index::post_index])
        .mount(
            "/genshin",
            routes![
                genshin::index,
                genshin::spiral_abyss,
                genshin::character,
                genshin::daily_note,
                genshin::enka,
                genshin::enka_info
            ],
        )
        .register(
            "/",
            catchers![
                error::default,
                error::not_found,
                error::internal_server_error
            ],
        )
}
