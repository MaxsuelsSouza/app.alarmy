import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    Container,
    Header,
    TimeToRing,
    DiasRow,
    DiaBtn,
    DiaText,
    BtnGravar,
    MiddleContent,
} from './styles';
import Relogio from '@/components/Relogio';
import { useDetalhesAlarme } from './page';

const diasDaSemana = [
    { label: 'D', value: 'DOM' },
    { label: 'S', value: 'SEG' },
    { label: 'T', value: 'TER' },
    { label: 'Q', value: 'QUA' },
    { label: 'Q', value: 'QUI' },
    { label: 'S', value: 'SEX' },
    { label: 'S', value: 'SAB' },
];

export default function DetalheAlarmeScreen() {
    const {
        hora,
        minuto,
        dias,
        incrementarHora,
        decrementarHora,
        incrementarMinuto,
        decrementarMinuto,
        toggleDia,
        salvarAlteracoes,
        excluirAlarme,
    } = useDetalhesAlarme();

    return (
        <Container>
            <Header>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/Home')}
                    style={{ position: 'absolute', left: -28 }}
                >
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <TimeToRing style={{ alignSelf: 'center' }}>Tocará em 53 min.</TimeToRing>
                <TouchableOpacity
                    onPress={excluirAlarme}
                    style={{ position: 'absolute', right: -28 }}
                >
                    <Ionicons name="trash" size={28} color="#fff" />
                </TouchableOpacity>
            </Header>

            <MiddleContent>
                <Relogio
                    hora={hora}
                    minuto={minuto}
                    incrementarHora={incrementarHora}
                    decrementarHora={decrementarHora}
                    incrementarMinuto={incrementarMinuto}
                    decrementarMinuto={decrementarMinuto}
                />

                <DiasRow>
                    {diasDaSemana.map(({ label, value }, idx) => (
                        <DiaBtn
                            key={idx}
                            ativo={dias.includes(value)}
                            onPress={() => toggleDia(value)}
                        >
                            <DiaText ativo={dias.includes(value)}>{label}</DiaText>
                        </DiaBtn>
                    ))}
                </DiasRow>


                <BtnGravar onPress={salvarAlteracoes}>
                    <DiaText style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Gravar</DiaText>
                </BtnGravar>
            </MiddleContent>
        </Container>
    );
}
