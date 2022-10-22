use crypto::{digest::Digest, md5::Md5};

pub fn md5(str: &str) -> String {
    let mut md5 = Md5::new();
    md5.input_str(str);
    md5.result_str()
}
