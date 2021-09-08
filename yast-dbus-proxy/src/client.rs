use dbus::blocking::Connection;
use dbus::arg::{ReadAll,Variant};
use std::time::Duration;
use std::collections::HashMap;

type LanguagesMap = HashMap<String,Vec<String>>;
type ProductsList = Vec<HashMap<String,String>>;
type StorageProposal = Vec<HashMap<String,String>>;
type DisksList = Vec<HashMap<String,String>>;
type OptionsMap = HashMap<String,Variant<String>>;

pub struct InstallerClient {
    conn: Connection,
}

impl InstallerClient {
    pub fn new() -> Result<Self, dbus::Error> {
        let conn = Connection::new_system()?;
        Ok(InstallerClient { conn })
    }


    pub fn get_products(&self) -> Result<ProductsList, dbus::Error> {
        let (products,): (ProductsList,) = self.method_call("GetProducts")?;
        Ok(products)
    }

    pub fn get_languages(&self) -> Result<LanguagesMap, dbus::Error> {
        let (languages,): (LanguagesMap,) = self.method_call("GetLanguages")?;
        Ok(languages)
    }

    pub fn get_storage(&self) -> Result<StorageProposal, dbus::Error> {
        let (storage,): (StorageProposal,) = self.method_call("GetStorage")?;
        Ok(storage)
    }

    pub fn get_disks(&self) -> Result<DisksList, dbus::Error> {
        let (disks,): (DisksList,) = self.method_call("GetDisks")?;
        Ok(disks)
    }

    pub fn get_options(&self) -> Result<OptionsMap, dbus::Error> {
        let proxy = self.conn.with_proxy(
            "org.opensuse.YaST", "/org/opensuse/YaST/Installer", Duration::from_millis(5000)
        );
        let (options,) = proxy.method_call("org.freedesktop.DBus.Properties", "GetAll", ("org.opensuse.YaST.Installer",))?;
        Ok(options)
    }

    pub fn set_option(&self, name: &str, value: &str) -> Result<(), dbus::Error> {
        let proxy = self.conn.with_proxy(
            "org.opensuse.YaST", "/org/opensuse/YaST/Installer", Duration::from_millis(5000)
        );
        proxy.method_call("org.freedesktop.DBus.Properties", "Set", ("org.opensuse.YaST.Installer", name, Variant(value)))?;
        Ok(())
    }

    fn method_call<R: ReadAll>(&self, method: &str) -> Result<R, dbus::Error> {
        let proxy = self.conn.with_proxy(
            "org.opensuse.YaST", "/org/opensuse/YaST/Installer", Duration::from_millis(5000)
        );
        proxy.method_call("org.opensuse.YaST.Installer", method, ())
    }
}
