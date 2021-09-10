use std::collections::HashMap;
use zbus::{dbus_proxy,Connection};

type LanguagesMap = HashMap<String,Vec<String>>;
type ProductsList = Vec<HashMap<String,String>>;
type StorageProposal = Vec<HashMap<String,String>>;
type DisksList = Vec<HashMap<String,String>>;
type OptionsMap = HashMap<String,String>;

#[dbus_proxy(
    interface =  "org.opensuse.YaST.Installer",
    default_service = "org.opensuse.YaST",
    default_path = "/org/opensuse/YaST/Installer"
)]
pub trait Installer {
    fn get_installation(&self) -> zbus::Result<HashMap<String,String>>;
    fn get_languages(&self) -> zbus::Result<LanguagesMap>;
    fn get_products(&self) -> zbus::Result<ProductsList>;
    fn get_disks(&self) -> zbus::Result<DisksList>;
    fn get_storage(&self) -> zbus::Result<StorageProposal>;

    #[dbus_proxy(property)]
    fn status(&self) -> zbus::Result<String>;

    #[dbus_proxy(property)]
    fn language(&self) -> zbus::Result<String>;
    #[dbus_proxy(property)]
    fn set_language(&self, value: String) -> zbus::Result<()>;

    #[dbus_proxy(property)]
    fn disk(&self) -> zbus::Result<String>;
    #[dbus_proxy(property)]
    fn set_disk(&self, value: String) -> zbus::Result<()>;

    #[dbus_proxy(property)]
    fn product(&self) -> zbus::Result<String>;
    #[dbus_proxy(property)]
    fn set_product(&self, value: String) -> zbus::Result<()>;
}

pub struct InstallerClient<'a> {
    // conn: Connection,
    proxy: InstallerProxy<'a>
}

impl InstallerClient<'_> {
    pub fn new() -> zbus::Result<Self> {
        let conn = Connection::system()?;
        let proxy = InstallerProxy::new(&conn)?;
        Ok(InstallerClient{ proxy })
    }

    pub fn get_installation(&self) -> zbus::Result<HashMap<String,String>> {
        let mut values = HashMap::with_capacity(1);
        values.insert(String::from("status"), self.proxy.status().unwrap());
        dbg!("called");
        Ok(values)
    }

    pub fn get_languages(&self) -> zbus::Result<LanguagesMap> {
        self.proxy.get_languages()
    }

    pub fn get_products(&self) -> zbus::Result<ProductsList> {
        self.proxy.get_products()
    }

    pub fn get_disks(&self) -> zbus::Result<DisksList> {
        self.proxy.get_disks()
    }

    pub fn get_storage(&self) -> zbus::Result<StorageProposal> {
        self.proxy.get_storage()
    }

    pub fn get_options(&self) -> zbus::Result<OptionsMap> {
        let mut options = HashMap::new();
        options.insert(String::from("disk"), self.proxy.disk()?);
        options.insert(String::from("language"), self.proxy.language()?);
        options.insert(String::from("product"), self.proxy.product()?);
        Ok(options)
    }

    pub fn set_option(&self, name: &str, value: String) -> zbus::Result<()> {
        match name { // FIXME: try to use the .set method from the PropertiesProxy
            "disk" => self.proxy.set_disk(value),
            "language" => self.proxy.set_language(value),
            "product" => self.proxy.set_product(value),
            _ => Err(zbus::Error::InvalidField)
        }
    }
}
