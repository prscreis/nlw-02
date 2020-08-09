import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TextInput } from "react-native";
import { BorderlessButton, RectButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from "@react-navigation/native";
//import RNPickerSelect from "react-native-picker-select";
import { Picker } from "@react-native-community/picker";

import PageHeader from "../../components/PageHeader";
import TeacherItem, { Teacher } from "../../components/TeacherItem";

import api from "../../services/api";

import styles from "./styles";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const [subject, setSubject] = useState("");
  const [week_day, setWeek_day] = useState("");
  const [time, setTime] = useState("");

  const loadFavorites = async () => {
    try {
      const response = await AsyncStorage.getItem("favorites");

      if (response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map(
          (teacher: Teacher) => {
            return teacher.id;
          }
        );

        setFavorites(favoritedTeachersIds);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(() => {
    async function f() {
      await loadFavorites();
    }

    f();
  });

  const handleToggleFiltersVisible = () => {
    setFiltersVisible(!filtersVisible);
  };

  const handleFiltersSubmit = async () => {
    try {
      await loadFavorites();

      const response = await api.get("classes", {
        params: {
          subject,
          week_day,
          time,
        },
      });

      setFiltersVisible(false);
      setTeachers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys disponíveis"
        headerRight={
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color="#FFF" />
          </BorderlessButton>
        }
      >
        {filtersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              placeholderTextColor="#C1BCCC"
              style={styles.input}
              value={subject}
              onChangeText={(text) => setSubject(text)}
              placeholder="Qual a matéria?"
            ></TextInput>
            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>

                {/* <TextInput
                  placeholderTextColor="#C1BCCC"
                  style={styles.input}
                  value={week_day}
                  onChangeText={(text) => setWeek_day(text)}
                  placeholder="Qual o dia?"
                ></TextInput> */}

                <Picker
                  selectedValue={week_day}
                  style={[styles.input]}
                  onValueChange={(value) => setWeek_day(value.toString())}
                >
                  <Picker.Item label="domingo" value="0" />
                  <Picker.Item label="segunda-feira" value="1" />
                  <Picker.Item label="terça-feira" value="2" />
                  <Picker.Item label="quarta-feira" value="3" />
                  <Picker.Item label="quinta-feira" value="4" />
                  <Picker.Item label="sexta-feira" value="5" />
                  <Picker.Item label="sábado" value="6" />
                </Picker>
                {/* <RNPickerSelect
                  value={week_day}
                  placeholder="Qual o dia?"
                  onValueChange={(value) => setWeek_day(value)}
                  items={[
                    { label: "domingo", value: "0" },
                    { label: "segunda-feira", value: "1" },
                    { label: "terça-feira", value: "2" },
                    { label: "quarta-feira", value: "3" },
                    { label: "quinta-feira", value: "4" },
                    { label: "sexta-feira", value: "5" },
                    { label: "sábado", value: "6" },
                  ]}
                /> */}
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  placeholderTextColor="#C1BCCC"
                  style={styles.input}
                  value={time}
                  onChangeText={(text) => setTime(text)}
                  placeholder="Qual horário?"
                ></TextInput>
              </View>
            </View>

            <RectButton
              style={styles.submitButton}
              onPress={handleFiltersSubmit}
            >
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      >
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TeacherList;
