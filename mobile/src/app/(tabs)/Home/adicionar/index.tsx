import React, { useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { API_URL } from '@/constants/api';
import {
    Container, Header, TimeToRing, PickerRow, PickerValue, PickerActive, PickerDots,
    DiasRow, DiaBtn, DiaText, BtnGravar, MiddleContent
} from './styles';

const diasDaSemana = [
    { label: 'D', value: 'DOM' },
    { label: 'S', value: 'SEG' },
    { label: 'T', value: 'TER' },
    { label: 'Q', value: 'QUA' },
    { label: 'Q', value: 'QUI' },
    { label: 'S', value: 'SEX' },
    { label: 'S', value: 'SAB' },
];

export default function AdicionarAlarmeScreen() {
    const [hora, setHora] = useState(17);
    const [minuto, setMinuto] = useState(10);
    const [dias, setDias] = useState<string[]>(['SEG', 'TER', 'QUA', 'QUI', 'SEX']);

    const toggleDia = (dia: string) => {
        setDias(prev =>
            prev.includes(dia)
                ? prev.filter(d => d !== dia)
                : [...prev, dia]
        );
    };

    const salvarAlarme = async () => {
        const horario = `${hora.toString().padStart(2, '0')}:${minuto
            .toString()
            .padStart(2, '0')}`;

        try {
            const res = await fetch(`${API_URL}/alarmes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    horario,
                    dificuldade: 2,
                    dias,
                }),
            });

            if (!res.ok) {
                throw new Error('Erro ao salvar alarme');
            }

            router.push('/(tabs)/Home');
        } catch (err) {
            console.error(err);
            Alert.alert('Erro', 'Não foi possível salvar o alarme.');
        }
    };

    const incrementarHora = () => {
        setHora(h => (h + 1) % 24);
    };

    const decrementarHora = () => {
        setHora(h => (h + 23) % 24);
    };

    const incrementarMinuto = () => {
        setMinuto(m => (m + 1) % 60);
    };

    const decrementarMinuto = () => {
        setMinuto(m => (m + 59) % 60);
    };

    return (
        <Container>
            <Header>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/Home')}
                    style={{ position: 'absolute', left: -28 }}
                >
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <TimeToRing style={{ alignSelf: 'center' }}>Adicionar Alarme</TimeToRing>
            </Header>

            <MiddleContent>
                <PickerRow>
                    <TouchableOpacity onPress={decrementarHora}>
                        <PickerValue>{(hora + 23) % 24}</PickerValue>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={decrementarMinuto}>
                        <PickerValue>{((minuto + 59) % 60).toString().padStart(2, '0')}</PickerValue>
                    </TouchableOpacity>
                </PickerRow>
                <PickerRow>
                    <PickerActive>{hora}</PickerActive>
                    <PickerDots>:</PickerDots>
                    <PickerActive>{minuto.toString().padStart(2, '0')}</PickerActive>
                </PickerRow>
                <PickerRow>
                    <TouchableOpacity onPress={incrementarHora}>
                        <PickerValue>{(hora + 1) % 24}</PickerValue>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={incrementarMinuto}>
                        <PickerValue>{((minuto + 1) % 60).toString().padStart(2, '0')}</PickerValue>
                    </TouchableOpacity>
                </PickerRow>

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

                <BtnGravar onPress={salvarAlarme}>
                    <DiaText style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Gravar</DiaText>
                </BtnGravar>
            </MiddleContent>
        </Container>
    );
}
