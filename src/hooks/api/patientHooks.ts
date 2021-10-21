import { AxiosError } from 'axios';
import { ReactQueryKeys } from 'hooks/constants';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

import patientsAPI from '../../api/patientsAPI';
import {
  HospitalsResponse,
  PaginationParams,
  PatientsPayload,
  PatientsResponse,
  RegisterPatientPayload,
} from '../../models/apiTypes';
import { RegisterPatientFormType } from '../../pages/RegisterPatient/types';
import urls from '../../routing/urls';

export const useGetHospitals = (params?: PaginationParams) => {
  return useQuery<HospitalsResponse, AxiosError, HospitalsResponse>(
    ReactQueryKeys.HospitalsQuery,
    async () => {
      const { request } = patientsAPI.single.getHospitals(params);
      const data = await request();

      return data;
    },
    {
      onError: (errors) => {
        console.log(errors);
      },

      retry: false,
    }
  );
};

export const useGetPatients = (params?: PatientsPayload) => {
  console.log(params?.search_term);
  return useQuery<PatientsResponse, AxiosError, PatientsResponse>(
    [
      ReactQueryKeys.PatientsQuery,
      params?.hospital_id,
      params?.limit,
      params?.offset,
      params?.search_term,
    ],
    async () => {
      const { request } = patientsAPI.single.getPatients(params);
      const data = await request();

      return data;
    },
    {
      onError: (errors) => {
        console.log(errors);
      },

      retry: false,
    }
  );
};

export const useRegisterPatient = () => {
  const history = useHistory();

  return useMutation<RegisterPatientPayload, AxiosError, RegisterPatientFormType>(
    (params) => {
      const { request } = patientsAPI.single.registerPatient({
        full_name: params.name,
        address: params.address,
        age: params.age,
        patient_hospital_id: params.patientHospitalId,
        year_of_birth: params.yearOfBirth,
        phone_1: params.phone1,
        phone_2: params.phone2,
        hospital_id: params.center.value,
        national_id: params.nationalId,
        gender: params.gender,
      });
      return request();
    },
    {
      onSuccess: () => {
        history.replace(urls.patients());
      },
      onError: (errors) => {
        console.log(errors);
      },
    }
  );
};
