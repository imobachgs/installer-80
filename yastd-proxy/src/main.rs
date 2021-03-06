use std::collections::HashMap;
use tide::{Response,Request,http::mime,StatusCode};
use tide::security::{CorsMiddleware, Origin};
use http_types::headers::HeaderValue;
use tide_websockets::WebSocket;
use client::InstallerClient;
use async_std::stream::StreamExt;

mod client;

async fn get_installation(mut _req: Request<()>) -> tide::Result {
    let client = InstallerClient::new()?;
    let json_body = serde_json::to_string(&client.get_installation()?)?;

    Ok(Response::builder(StatusCode::Ok)
       .body(json_body)
       .content_type(mime::JSON)
       .build())
}

async fn handle_installation(mut _req: Request<()>) -> tide::Result {
    // TODO: implement 'start' and 'cancel' actions. For the time being, it will
    // always start the installation.
    let client = InstallerClient::new()?;
    let json_body = serde_json::to_string(&client.start()?)?;
    Ok(Response::builder(StatusCode::Ok)
       .body(json_body)
       .content_type(mime::JSON)
       .build())
}

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
    let options = client.get_options().unwrap();
    let json_body = serde_json::to_string(&options)?;

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
        client.set_option(&name, value)?;
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
    app.at("/installation.json").get(get_installation);
    app.at("/installation.json").put(handle_installation);
    app.at("/products.json").get(get_products);
    app.at("/languages.json").get(get_languages);
    app.at("/storage.json").get(get_storage);
    app.at("/disks.json").get(get_disks);
    app.at("/options.json").get(get_options);
    app.at("/options.json").put(set_options);
    app.at("/ws")
       .with(WebSocket::new(|_request, stream| async move {
           // FIXME: integrate this code into the client and improve error handling
           let connection = zbus::azync::Connection::system().await?;

           let props = zbus::fdo::AsyncPropertiesProxy::builder(&connection)
               .destination("org.opensuse.YaST")?
               .path("/org/opensuse/YaST/Installer")?
               .build().await?;

           let mut props_changed_stream = props.receive_properties_changed().await?;

           async {
               while let Some(signal) = props_changed_stream.next().await {
                   let args = signal.args().unwrap();
                   let mut data: HashMap<String,String> = HashMap::new();
                   for (k, v) in args.changed_properties {
                       if let Some(value) = v.downcast() {
                           data.insert(String::from(k).to_lowercase(), value);
                       }
                   }

                   dbg!(&data);
                   stream.send_json(&data).await.unwrap();
               }
           }.await;

           Ok(())
       }))
       .get(|_| async move { Ok("this was not a websocket request") });

    app.listen("localhost:3000").await?;
    Ok(())
}
