use ureq::serde_json::Value;

pub fn get(
    url: &str,
    headers: Option<Vec<(String, String)>>,
    cookies: Option<&str>,
) -> Result<Value, Box<dyn std::error::Error>> {
    let res = request("GET", url, None, headers, cookies)?;
    Ok(res)
}

pub fn post(
    url: &str,
    headers: Option<Vec<(String, String)>>,
    body: Value,
    cookies: Option<&str>,
) -> Result<Value, Box<dyn std::error::Error>> {
    let res = request("POST", url, Some(body), headers, cookies)?;
    Ok(res)
}

fn request(
    method: &str,
    url: &str,
    body: Option<Value>,
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

    let res = match method {
        "POST" => request.send_json(body.unwrap())?.into_json()?,
        "GET" | _ => request.call()?.into_json()?,
    };
    Ok(res)
}
