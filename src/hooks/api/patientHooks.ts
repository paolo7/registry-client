import { AxiosError } from 'axios';
import { ReactQueryKeys } from 'hooks/constants';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

import patientsAPI from '../../api/patientsAPI';
import {
  HospitalsAPI,
  HospitalsResponse,
  PaginationParams,
  PatientAPI,
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
      return await request();
    },
    {
      onError: (errors) => {
        console.log(errors);
      },

      retry: false,
    }
  );
};

export const useGetHospital = (id: string) => {
  return useQuery<HospitalsAPI, AxiosError, HospitalsAPI>(
    [ReactQueryKeys.HospitalsQuery, id],
    async () => {
      const { request } = patientsAPI.single.getHospital(id);
      return await request();
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
  return useQuery<PatientsResponse, AxiosError, PatientsResponse>(
    [
      ReactQueryKeys.PatientsQuery,
      params?.hospital_id,
      params?.limit,
      params?.offset,
      params?.search_term,
      params?.ordering,
    ],
    async () => {
      if (params?.hospital_id === undefined) {
        return undefined;
      }
      const { request } = patientsAPI.single.getPatients(params);
      return await request();
    },
    {
      onError: (errors) => {
        console.log(errors);
      },

      retry: false,
    }
  );
};

export const useGetPatient = (id: string) => {
  return useQuery<PatientAPI, AxiosError, PatientAPI>(
    [ReactQueryKeys.PatientsQuery, id],
    async () => {
      const { request } = patientsAPI.single.getPatient(id);
      return await request();
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
        hospital_id: params.hospital.value,
        full_name: `${params.firstName} ${params.lastName}`,
        year_of_birth: params.yearOfBirth,
        age: params.age,
        national_id: params.nationalId,
        patient_hospital_id: params.patientHospitalId,
        gender: params.gender,
        address: params.address,
        phone_1: params.phone1,
        phone_2: params.phone2,
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
