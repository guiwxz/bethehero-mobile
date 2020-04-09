import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import api from '../../services/api';

import logoImg from '../../assets/logo.png';
import styles from './styles';

export default function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    function navigateToDetail(incident) {
        navigation.navigate('Detail', { incident });
    }


    async function loadIncidents(){
        if(loading) {
            return;
        }
        
        if(total > 0 && incidents.lenght == total){
            return;
        }

        setLoading(true);

        const response = await api.get('incidents', { params: {page} });

        setIncidents([...incidents, ...response.data]); // esses 3 pontinhos é uma forma de anexar dois vetores em um, assim adiciona todos os valores do segundo parametro no primeiro
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        setLoading(false);
    }


    useEffect(() => {loadIncidents()}, [])


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.bold}>{total} casos</Text>
                </Text>
            </View>

            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

            <FlatList // serve pra criar um tipo de lista pra ter o scroll
                data={incidents} // dados e quantidade
                style={styles.incidentList}
                keyExtractor={incident => String(incident.id)} // serve pra identificar cada incident com o id que vem do backend
                showsVerticalScrollIndicator={false} // tira a barrinha de rolar pra descer a tela
                onEndReached={loadIncidents} // dispara essa funcao quando chegar no final da lista, pra carregar mais coisa
                onEndReachedThreshold={0.2} // porcentagem do final da lista que precisa estar pra carregar o novo conteudo
                renderItem={( { item: incident } ) => (  // render item recebe uma funcao no formato JSX, por isso é () e nao {}
                    <View style={styles.incident}>
                        <Text style={styles.incidentProperty}>ONG:</Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>

                        <Text style={styles.incidentProperty}>CASO:</Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>

                        <Text style={styles.incidentProperty}>VALOR:</Text>
                        <Text style={styles.incidentValue}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(incident.value)}</Text>

                        <TouchableOpacity style={styles.detailsButton} onPress={() => navigateToDetail(incident)}> 
                            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#E82041" />
                        </TouchableOpacity>
                    </View>
                )}
            />
           
        </View>
    );
}