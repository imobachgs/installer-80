use std::collections::HashMap;
use tide::{Response,Request,http::mime,StatusCode};
use tide::security::{CorsMiddleware, Origin};
use http_types::headers::HeaderValue;
use client::InstallerClient;
use dbus::arg::RefArg;

mod client;

async fn get_products(mut _req: Request<()>) -> tide::Result {
    let client = InstallerClient::new()?;
    let json_body = serde_json::to_string(&client.get_products()?)?;

    Ok(Response::builder(StatusCode::Ok)
       .body(json_body)
       .content_type(mime::JSON)
       .build())
}

async fn get_languages(mut _req: Request<()>) -> tide::Result {
    let client = InstallerClient::new()?;
    let languages = client.get_languages()?;

    // TODO: use map() or something like that?
    let mut langs = Vec::new();

    for (name, list) in languages {
        let mut lang = HashMap::with_capacity(2);
        lang.insert("id", name);
        lang.insert("name", list[0].clone());
        langs.push(lang)
    }

    let json_body = serde_json::to_string(&langs)?;

    Ok(Response::builder(StatusCode::Ok)
       .body(json_body)
       .content_type(mime::JSON)
       .build())
}

async fn get_disks(mut _req: Request<()>) -> tide::Result {
    let client = InstallerClient::new()?;
    let disks = client.get_disks()?;
    let json_body = serde_json::to_string(&disks)?;

    Ok(Response::builder(StatusCode::Ok)
       .body(json_body)
       .content_type(mime::JSON)
       .build())
}

async fn get_storage(mut _req: Request<()>) -> tide::Result {
    let client = InstallerClient::new()?;
    let storage = client.get_storage()?;
    let json_body = serde_json::to_string(&storage)?;

    Ok(Response::builder(StatusCode::Ok)
       .body(json_body)
       .content_type(mime::JSON)
       .build())
}

async fn get_options(mut _req: Request<()>) -> tide::Result {
    let client = InstallerClient::new()?;
    let options = client.get_options()?;
    let mut exported_options: HashMap<String,String> = HashMap::new();
    for (key, value) in options {
        let value_as_string = value.as_str().unwrap_or("").into();
        exported_options.insert(key, value_as_string);
    }
    let json_body = serde_json::to_string(&exported_options)?;

    Ok(Response::builder(StatusCode::Ok)
       .body(json_body)
       .content_type(mime::JSON)
       .build()
    )
}

async fn set_options(mut req: Request<()>) -> tide::Result {
    let body: HashMap<String, String> = req.body_json().await.unwrap();
    let client = InstallerClient::new()?;
    for (name, value) in body {
        client.set_option(&name, &value)?;
    }
    Ok(Response::builder(StatusCode::Ok)
       .content_type(mime::JSON)
       .build()
    )
}

#[async_std::main]
async fn main() -> tide::Result<()> {
    let mut app = tide::new();
    let cors = CorsMiddleware::new()
        .allow_methods("GET, POST, PUT, OPTIONS".parse::<HeaderValue>().unwrap())
        .allow_origin(Origin::from("*"))
        .allow_credentials(false);
    app.with(cors);
    app.at("/products.json").get(get_products);
    app.at("/languages.json").get(get_languages);
    app.at("/storage.json").get(get_storage);
    app.at("/disks.json").get(get_disks);
    app.at("/options.json").get(get_options);
    app.at("/options.json").put(set_options);
    app.listen("localhost:3000").await?;
    Ok(())
}
