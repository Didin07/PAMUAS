import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';

const MyForm = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [sallary, setSallary] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const handleOrientationChange = () => {
      const newIsLandscape = width > height;
      setIsLandscape(newIsLandscape);
    };

    Dimensions.addEventListener('change', handleOrientationChange);

    return () => {
      Dimensions.removeEventListener('change', handleOrientationChange);
    };
  }, [width, height]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://658017246ae0629a3f54505a.mockapi.io/Api/employee');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAdd = async () => {
    if (name === '' || sallary === '') {
      alert('Nama dan Gaji tidak boleh kosong!');
    } else {
      try {
        const response = await fetch('https://658017246ae0629a3f54505a.mockapi.io/Api/employee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, sallary }),
        });

        const result = await response.json();
        setData([...data, result]);
        setName('');
        setSallary('');
        alert('Terima Kasih! Data Berhasil Ditambahkan!');
      } catch (error) {
        console.error('Error menambahkan data:', error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://658017246ae0629a3f54505a.mockapi.io/Api/employee/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, sallary }),
      });

      const updatedItem = await response.json();
      setData(data.map(item => (item.id === updatedItem.id ? updatedItem : item)));
      setIsModalVisible(false);
      alert('Data berhasil diperbarui!');
    } catch (error) {
      console.error('Error memperbarui data:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`https://658017246ae0629a3f54505a.mockapi.io/Api/employee/${selectedItem.id}`, {
        method: 'DELETE',
      });

      setData(data.filter(item => item.id !== selectedItem.id));
      setIsModalVisible(false);
      alert('Data berhasil dihapus!');
    } catch (error) {
      console.error('Error menghapus data:', error);
    }
  };

  useEffect(() => {
    if (!isModalVisible) {
      setName('');
      setSallary('');
    }
  }, [isModalVisible]);

  const openUpdateModal = (item) => {
    setSelectedItem(item);
    setName(item.name);
    setSallary(item.sallary);
    setIsModalVisible(true);
  };

  const logoUrl = require('./assets/logo.png');

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <Image source={logoUrl} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Aplikasi Data Karyawan PT.Nahkoda Nusantara</Text>

      <View>
        <TextInput
          style={[styles.input, isLandscape && styles.inputLandscape]}
          placeholder="Nama"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={[styles.input, isLandscape && styles.inputLandscape]}
          placeholder="Gaji"
          value={sallary}
          onChangeText={(text) => setSallary(text)}
        />
        <View style={{ marginBottom: 20 }}>
          <Button title="Tambah Data" onPress={handleAdd} />
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openUpdateModal(item)}>
            <View style={styles.listItem}>
              <Text style={styles.listItemName}>{item.name}</Text>
              <Text>Rp{item.sallary}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.title}>Perbarui Data Karyawan</Text>
            <TextInput
              style={[styles.input, isLandscape && styles.inputLandscape]}
              placeholder="Nama"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={[styles.input, isLandscape && styles.inputLandscape]}
              placeholder="Gaji"
              value={sallary}
              onChangeText={(text) => setSallary(text)}
            />
          </View>
          <View>
            <View style={{ marginBottom: 10 }}>
              <Button title="Perbarui" onPress={handleUpdate} color="green" />
            </View>
            <Button title="Hapus" onPress={handleDelete} color="red" />
            <TouchableOpacity style={styles.buttonCancel} onPress={() => { setIsModalVisible(false); }}>
              <Text style={styles.buttonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    paddingTop: 50,
  },
  containerLandscape: {
    flexDirection: 'row',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  inputLandscape: {
    flex: 1,
    marginRight: 8,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  modalContainer: {
    paddingTop: 50,
    height: '100%',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  buttonCancel: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'blue',
    fontWeight: 'bold',
  },
  listItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyForm;
