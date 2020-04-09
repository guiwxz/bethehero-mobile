import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer';
import { Linking } from 'react-native';

import styles from './styles';
import logoImg from '../../assets/logo.png';

export default function Detail() { 
    const [detalhes, setDetalhes] = useState(false);
    const [flecha, setFlecha] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();

    const incident = route.params.incident;
    const message = `Olá ${incident.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(incident.value)}`;

    function navigateBack(){
        navigation.goBack()
    }

    function sendEmail() {
        MailComposer.composeAsync({
            subject: `Herói do caso: ${incident.title}`,
            recipients: [incident.email],
            body: message,
        })
    }

    function sendWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=${incident.whatsapp}&text=${message}`);
    }

    function press() {
        if(!detalhes){
            setDetalhes(true);
            setFlecha(true);
        }else{
            setDetalhes(false);
            setFlecha(false);
        }
    }

    const textValue = detalhes?incident.description : "";
    const arrows = detalhes?"arrow-up" : "arrow-down";

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg}/>

                <TouchableOpacity onPress={navigateBack}>
                    <Feather name="arrow-left" size={28} color="#e82041"></Feather>
                </TouchableOpacity>
                
            </View>

            <View style={styles.incident}>
                <Text style={[styles.incidentProperty, { marginTop: 0, }]}>ONG:</Text>
                <Text style={styles.incidentValue}>{incident.name} de {incident.city}/{incident.uf}</Text>

                <Text style={styles.incidentProperty}>CASO:</Text>
                <Text style={styles.incidentValue}>{incident.title}</Text>

                
                <TouchableOpacity style={styles.descriptionButton} onPress={ () => press() }>
                    <Text style={styles.descriptionButtonText}>Descrição</Text>
                    <Feather name={arrows} size={15} color="#e82041" style={{marginTop: 10,}}></Feather>
                </TouchableOpacity>

                
                <Text style={{marginTop: 4, color: '#737380', fontStyle: 'italic'}}>{textValue}</Text>
                

                <Text style={styles.incidentPropertyValue}>VALOR:</Text>
                <Text style={styles.incidentValue}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(incident.value)}</Text>
            </View>
        
            <View style={styles.contactBox}>
                <Text style={styles.heroTitle}>Salve o dia!</Text>
                <Text style={styles.heroTitle}>Seja o herói desse caso.</Text>

                <Text style={styles.heroDescription}>Entre em contato:</Text>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={sendWhatsapp} style={styles.action}>
                        <Text style={styles.actionText}>WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={sendEmail} style={styles.action}>
                        <Text style={styles.actionText}>E-mail</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}