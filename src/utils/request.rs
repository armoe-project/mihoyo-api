use rocket::serde::json::Value;

pub fn get(
    url: &str,
    headers: Option<Vec<(String, String)>>,
    cookies: Option<&str>,
) -> Result<Value, Box<dyn std::error::Error>> {
    let res = request("GET", url, headers, cookies)?;
    Ok(res)
}

fn request(
    method: &str,
    url: &str,
    headers: Option<Vec<(String, String)>>,
    cookies: Option<&str>,
) -> Result<Value, Box<dyn std::error::Error>> {
    let mut request = ureq::request(method, url);

    if cookies.is_some() {
        request = request.set("cookie", cookies.unwrap());
    }

    if headers.is_some() {
        for ele in headers.unwrap() {
            request = request.set(&ele.0, &ele.1);
        }
    }

    let res = request.call()?.into_json()?;
    Ok(res)
}
